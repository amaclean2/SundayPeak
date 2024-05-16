import { useRef, useState } from 'react'
import { Axis, Orientation } from '@visx/axis'
import { localPoint } from '@visx/event'
import { GridRows } from '@visx/grid'
import { scaleLinear } from '@visx/scale'
import { AreaClosed, Bar, Line } from '@visx/shape'
import { TooltipWithBounds, defaultStyles } from '@visx/tooltip'

import './styles.css'

const background = 'transparent'
const gridColor = '#204051'
const accentColor = '#AFDBD0'
const accentColorDark = '#02AD85'
const tooltipStyles = {
	...defaultStyles,
	background: '#FFF',
	border: '1px solid white',
	color: 'black'
}

const subtract = (...params) => {
	let [first, ...rest] = params
	rest.forEach((p) => (first -= p))

	return first
}

const ElevationChart = ({
	width,
	height = 200,
	margin = { top: 0, right: 0, bottom: 25, left: 1 },
	data
}) => {
	const innerWidth = width - margin.left - margin.right
	const innerHeight = height - margin.top - margin.bottom
	const [tooltipData, setTooltipData] = useState(null)
	const [tooltipLeft, setTooltipLeft] = useState(0)
	const [tooltipTop, setTooltipTop] = useState(0)

	const frameRef = useRef(null)

	const distanceScale = scaleLinear({
		range: [margin.left, innerWidth + margin.left],
		domain: [0, data[data.length - 1]?.[1]]
	})

	const elevationScale = scaleLinear({
		range: [innerHeight + margin.top, margin.top],
		domain: [Math.min(...data.map((d) => d[0])), Math.max(...data.map((d) => d[0]))],
		nice: true
	})

	const handleTooltip = (event) => {
		const { x } = localPoint(event) || { x: 0 }
		const x0 = distanceScale.invert(x)
		const idx = data.findIndex((d) => d[1] >= x0)
		const d0 = data[idx - 1]
		const d1 = data[idx]
		let d = d1
		if (d1 && d0) {
			d = x0.valueOf() - d0[1] > d1[1] - x0.valueOf() ? d1 : d0
		}
		setTooltipData(d)
		setTooltipLeft(x)
		setTooltipTop(elevationScale(d[0]))
	}

	const hideTooltip = () => {
		setTooltipData(null)
		setTooltipLeft(0)
		setTooltipTop(0)
	}

	if (width < 10) return null

	return (
		<div
			ref={frameRef}
			className={'elevation-chart'}
		>
			<svg
				width={width}
				height={height}
			>
				<rect
					x={0}
					y={0}
					width={width}
					height={height}
					fill={background}
				/>
				<GridRows
					left={margin.left}
					scale={elevationScale}
					width={innerWidth}
					strokeDasharray={'4,2'}
					stroke={gridColor}
					strokeOpacity={0.2}
					pointerEvents={'none'}
					numTicks={Math.round(Math.abs(subtract(...elevationScale.domain())) / 1000)}
				/>
				<AreaClosed
					data={data}
					x={(d) => distanceScale(d[1] ?? 0)}
					y={(d) => elevationScale(d[0] ?? 0)}
					yScale={elevationScale}
					strokeWidth={1}
					stroke={accentColorDark}
					fill={accentColor}
				/>
				<Axis
					key={Math.random()}
					orientation={Orientation.bottom}
					top={innerHeight}
					scale={distanceScale}
					stroke={accentColorDark}
					tickStroke={accentColorDark}
					tickFormat={(v, idx) => (!idx ? '' : `${v} mi`)}
					tickLabelProps={{
						fill: accentColorDark,
						fontSize: 12,
						fontFamily: 'sans-serif',
						textAnchor: 'middle'
					}}
					numTicks={5}
				/>
				<Bar
					x={margin.left}
					y={margin.top}
					width={innerWidth}
					height={innerHeight}
					fill={'transparent'}
					rx={14}
					onTouchStart={handleTooltip}
					onTouchMove={handleTooltip}
					onMouseMove={handleTooltip}
					onMouseLeave={hideTooltip}
				/>
				{tooltipData && (
					<g>
						<Line
							from={{ x: tooltipLeft, y: margin.top }}
							to={{ x: tooltipLeft, y: innerHeight + margin.top }}
							stroke={accentColorDark}
							strokeWidth={2}
							pointerEvents={'none'}
							strokeDasharray={'5,2'}
						/>
						<circle
							cx={tooltipLeft}
							cy={tooltipTop + 1}
							r={4}
							fill={'black'}
							fillOpacity={0.1}
							stroke='black'
							strokeOpacity={0.1}
							strokeWidth={2}
							pointerEvents='none'
						/>
						<circle
							cx={tooltipLeft}
							cy={tooltipTop}
							r={4}
							fill={accentColorDark}
							stroke='white'
							strokeWidth={2}
							pointerEvents='none'
						/>
					</g>
				)}
			</svg>
			{tooltipData && (
				<div>
					<TooltipWithBounds
						key={Math.random()}
						top={tooltipTop + frameRef.current.getBoundingClientRect().top - 20}
						left={tooltipLeft}
						style={tooltipStyles}
					>
						{`${tooltipData[0].toFixed(0)} ft`}
					</TooltipWithBounds>
					{/* <Tooltip
						top={innerHeight + 125}
						left={tooltipLeft}
						style={{
							...defaultStyles,
							textAlign: 'center',
							transform: 'translateX(-50%)'
						}}
					>
						{`${tooltipData[1].toFixed(2)} mi`}
					</Tooltip> */}
				</div>
			)}
		</div>
	)
}

export default ElevationChart
