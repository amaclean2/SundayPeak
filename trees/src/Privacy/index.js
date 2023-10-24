import React from 'react'

import './styles.css'
import { Link } from 'react-router-dom'

const UpdatedDate = () => {
	return <>Saturday, October 21, 2023</>
}

const PrivacyPolicy = () => {
  return (
      <div className='content-container'>
				<article>
					<section className='header-block'>
						<h1>Sunday Peak Privacy Policy</h1>
						<p className='updated-date'>
							Last Updated: <UpdatedDate />
						</p>
					</section>
          <section id='overview'>
						<p>
							Sunday Peak is here to facilitate adventures and to get users connected with friends.
							We are not trying to collect more data than we absolute need to. All the data given to
							us stops with us. We don't give it away to anyone else and we don't sell anyone's
							information.
						</p>
						<p>
							We are a growing platform and as we add features and make changes, some of the
							information in this policy may change. When it does, we will make sure to send an
							email so you can see the lastest updates.
						</p>
					</section>
          <hr />
					<section id='information-collected'>
						<h2>Information Collected</h2>
						<p>
							Sunday Peak collects information that identifies the user in a few ways around our
							platform. Most of what we collect is information one can choose to share or not. As we
							partner with other services to make data collection easier, that data can become part
							of the user's public profile. All of this is able to be opted out of if one chooses to
							do so.
						</p>
						<p>
							There are places to add information including pictures and bio statements in the user
							profile section and adventures. We currently don't monitor what goes in these areas.
							If any of it becomes a concern we will develop policies to restrict this information.
						</p>
						{/* <section id='required-information'> */}
							<h3>Required Information</h3>
							<p>
								The only required information we need is an email, password, and first and last
								names.
							</p>
							<p>
								We collect an email and password to uniquely idenity the user and send updates and
								other relevant information to the user. These emails can be opted out of by clicking
								the unsubscribe button in the footer of the email.
							</p>
							<p>
								The user's first and last name is collected to give an identifier on the platform.
								The goal of Sunday Peak is to facilitate communication with other users and by
								having a name associated with a profile, it makes each user more approachable. The
								name provided is not required to be a real name, but it helps communication with
								other people.
							</p>
						{/* </section> */}
						{/* <section id='non-required-information'> */}
							<h3>Non-Required Information</h3>
							<p>All the information below is completely voluntary.</p>
							<p>
								There is the option to provide other information about the user on the platform
								including but not limited to the fields below. This information can further identify
								users to others and give people communicating a better understanding of who they're
								talking to. As mentioned above, we don't anticipate abuse of this information, but
								if we are alerted that has become the case, we will make policies to prevent abuse.
							</p>
							<h4>Other Fields Collected (not limited to)</h4>
							<ul>
								<li>Hometown</li>
								<li>User website</li>
								<li>Open format bio</li>
								<li>Photos one chooses to post</li>
								<li>Phone number (this is not made public but for two factor authentication)</li>
							</ul>
							<p>
								We recommend not to share extra private information in conversations on the platform
								or in open format sections, but you are allowed to do so at your own risk.
							</p>
							<h4>Statistics</h4>
							<p>
								Data collected from third parties may include information pertaining to health or
								fitness. We will not make this information public outside of what is required for
								the details on the platform.
							</p>
							<h4>Contacts</h4>
							<p>
								We will not collect information from contacts. If one chooses to share Sunday Peak
								with their friends or family, we greatly appreciate that, but it is not obligatory.
							</p>
							<h4>Payment Information</h4>
							<p>
								All versions of Sunday Peak are currently free and open to use, but as we grow, we
								reserve the right to create a premium plan. With this we will have to collect
								payment information to process a subscription. This information will only be used
								for the explicit uses allowed by the user and will not be published. We will use
								trusted thrid-party payment services for processing so that we will not store any
								sensitive information.
							</p>
							<h4>Third-Party Accounts</h4>
							<p>
								A user can log into Sunday Peak through third-party accounts. This information isn't
								stored in Sunday Peak but in a separate authorization provider. We will not publish
								nor store any information given to that provider.
							</p>
						{/* </section> */}
					</section>
          <hr />
					<section id='what-you-can-do'>
						<h2>How To Remove Data</h2>
						<p>
							Most data on the platform can be added or removed by the 'Edit User' or 'Edit
							Adventure' buttons. If a user account is to be deleted then that can be processed by
							the delete user button. If the user wishes to remove data that can't be found in
							either of the edit views but they don't want to remove their account, then they can
							fill out a request in our <Link to={'/support'}>support form</Link> and we can work
							to process that data.
						</p>
					</section>
					<hr />
					<section id='how-data-is-used'>
						<h2>How Sunday Peak Uses This Information</h2>
						<p>
							Sunday Peak aims to create a database of activities for users to take part in. This
							information contains locations and statistics about each activity but none of it is
							unique to a user unless that user chooses to publish unique data.
						</p>
						<p>
							Statistics about the user specifically is to show what the user has accomplished. The
							services we intend to provide with this data are given below.
						</p>
						<ul>
							<li>
								Create a database of activites to select from when engaging in a new adventure
							</li>
							<li>Show a user's list of activities they've completed</li>
							<li>Show a user's list of activites they wish to complete</li>
							<li>Communicate with other users on activites to do together</li>
							<li>Alert a user when someone wants to do an activity with them</li>
						</ul>
					</section>
					<hr />
					<section>
						<h2>Information Retention</h2>
						<p>
							We keep information about users and adventures as long is it useful to the operation
							of Sunday Peak with exceptions. If as user has asked to delete data, or deletes or
							changes information in their account we will remove that information. Any information
							a user has not marked as public will not be viewable to anyone but themselves. The
							retention time span of information is determined on the amount of information stored.
							Most long lasting data about users will available as long as the user keeps their
							account.
						</p>
					</section>
					<hr />
					<section>
						<h2>How We Protect Information</h2>
						<p>
							Sunday Peak uses several industry standard practices to secure data transmitted to and
							from our servers. All web and mobile traffic is protected with SSL encryption. Our
							servers are protected by industry leading providers and firewalls to prevent
							breaching. All sensitive data including authentication and payments are handled by
							secure third-party providers to manage data transaction and storage.
						</p>
					</section>
					<hr />
					<section>
						<h2>Policy Information</h2>
						<p>
							As stated above, Sunday Peak is constantly growing and changing. Some of those changes
							might affect the content of this Privacy Policy. If this policy changes in any way, an
							email will be sent out to our users and a notice will be provided. If you object to
							any of the content in this Privacy Policy, then you should stop using Sunday Peak and
							delete your account.
						</p>
						<p>If you have any questions, fill out our <Link to="/support">support form</Link> and we will get back to you as soon as we can.</p>
						<p>2022 Sunday Peak</p>
					</section>
        </article>
      </div>
  )
}

export default PrivacyPolicy