# WEB103 Prework - *Creatorverse*

Submitted by: **Raymond Frimpong Amoateng**

About this web app: **Creatorverse is a CRUD application for managing content creators. Users can add, view, edit, and delete creators with their social media links (YouTube, Twitter, Instagram). The app features a dark space-themed design with glassmorphism effects, responsive layout, and smooth animations.**

Time spent: **13** hours

## Required Features

The following **required** functionality is completed:

<!-- 👉🏿👉🏿👉🏿 Make sure to check off completed functionality below -->

- [x] **A logical component structure in React is used to create the frontend of the app**

- [x] **At least five content creators are displayed on the homepage of the app**

- [x] **Each content creator item includes their name, a link to their channel/page, and a short description of their content**

- [x] **API calls use the async/await design pattern via Axios or fetch()**

- [x] **Clicking on a content creator item takes the user to their details page, which includes their name, url, and description**

- [x] **Each content creator has their own unique URL**

- [x] **The user can edit a content creator to change their name, url, or description**

- [x] **The user can delete a content creator**

- [x] **The user can add a new content creator by entering a name, url, or description and then it is displayed on the homepage**

The following **optional** features are implemented:

- [x] Picocss is used to style HTML elements

- [x] The content creator items are displayed in a creative format, like cards instead of a list

- [x] An image of each content creator is shown on their content creator card

The following **additional** features are implemented:

* [x] **Dark space-themed design** with animated background and glassmorphism effects
* [x] **Social media integration** - Separate fields for YouTube, Twitter, and Instagram with automatic URL construction from usernames
* [x] **Modal confirmation dialogs** for delete actions to prevent accidental deletions
* [x] **Responsive design** - Fully responsive layout that works on mobile, tablet, and desktop devices
* [x] **Smooth animations** - Page transitions, card hover effects, and modal animations
* [x] **Inline form on homepage** - Add creator form appears directly on the home page instead of navigating to a separate route
* [x] **Social media icons** - Visual icons for each platform displayed on creator cards and detail pages
* [x] **Username input system** - Users only need to enter usernames, and the app automatically constructs full URLs
* [x] **Touch-friendly interface** - Optimized for mobile devices with appropriate touch targets
* [x] **Accessibility features** - Reduced motion support, proper ARIA labels, and keyboard navigation

## Video Walkthrough

Here's a walkthrough of implemented required features:

<img src='walkthrough.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

GIF created with LiceCap

<!-- Recommended tools:

[Kap](https://getkap.co/) for macOS

[ScreenToGif](https://www.screentogif.com/) for Windows

[peek](https://github.com/phw/peek) for Linux. -->

## Notes

**Challenges encountered:**
- Setting up Supabase authentication and Row Level Security (RLS) policies required careful configuration
- Creating a responsive design that works well across all device sizes required multiple breakpoints and careful CSS planning
- Converting between usernames and full URLs for editing existing creators required handling multiple URL formats (especially YouTube's various URL patterns)


**Additional context:**
- All database operations use async/await pattern with proper error handling
- The form validation ensures at least one social media link is provided
- Images are optional - cards display a gradient background if no image is provided

## License

Copyright [2025] [Raymond Frimpong Amoateng]

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
