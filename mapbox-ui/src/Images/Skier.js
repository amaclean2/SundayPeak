import { memo } from "react";

const Skier = ({ size = 30 }) => (
	<svg id="Skier" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 0 83.377 84.049">
		<rect id="Rectangle_15" data-name="Rectangle 15" width="88" height="2" transform="translate(0.684 52.072) rotate(20)" />
		<path id="Path_2" data-name="Path 2" d="M611.32,331.679s-16.059,12.382-18.179,14.919-2.123,2.76-1.866,5.453,10.675,14.913,10.675,14.913-15.747,9.482-19.108,11.313a5.206,5.206,0,0,0-3,4.92l12.828,4.543a7.3,7.3,0,0,0,0-3.755c-.6-1.412-3.731-3.735-3.731-3.735l14.231-7.547s3.458-1.141,4.33-3.339a5.81,5.81,0,0,0,0-4.164l-6.548-14.571,14-11.579s3.878-2.17,2.1-5.627S611.32,331.679,611.32,331.679Z" transform="translate(-548.654 -322)" />
		<path id="Path_3" data-name="Path 3" d="M615.726,347.558s-2.606,7.2-2.248,9.367S628.07,367,628.07,367s1.687.575,1.963-.647-1.056-1.931-1.056-1.931l-10.918-8.99,4.417-14.844a20.644,20.644,0,0,1-2.4,3.277A46.512,46.512,0,0,1,615.726,347.558Z" transform="translate(-551.955 -326.945)" />
		<circle id="Ellipse_3" data-name="Ellipse 3" cx="6" cy="6" r="6" transform="translate(69.346)" />
	</svg>
);

export default memo(Skier);