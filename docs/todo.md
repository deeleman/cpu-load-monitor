# TO-DO Items and Future enhancements
Given the POC nature of this application, there's still a lot of room for improvement. Please find below a detailed rundown of suggested improvements and enhancements ideas. Some of them are particularly relevant in order to take this application to a production level environment.

### 1. Eject application from CRA or introduce a better, leaner build workflow
Create React App provides a quick, zero-configuration enviroment for rapid development on React, but it is definitely not a proper build tool for a production environment.

Before moving into an enterprise environment, the underlying Webpack config should be ejected and the overall testing and bundling pipelines should be adapted for our particular business particular requirements. Another alternative would be to implement a non-webpack alternative for building production-ready bundles: Snowpack, Rollup, Parcel, etc.

### 2. Split frontend and backend into separate packages
Given the POC nature of this project, having both the frontend and the backend coexisting in the same workspace by sharing the same `package.json` manifest might suffice for demoing purposes.

In a production environment this might be considered an antipattern. Ideally, frontend and backend should exist as standalone applications (or _packages_, if a monorepo is considered). Each domain should feature its own distinct `package.json` file, dependency handling and build pipeline flow.

### 3. Setup a build pipeline for server
Currently, the backend application is a tiny handful of 2 Node.js scripts plus a config file, so it might seem overkill to implement a thorough build workflow. However, a proper build pipeline in place might allow us to properly bundle and minify the overall server implementation file footprint, leading to storage savings should the application grows bigger. Furthermore, we can attach particular server testing to the pipeline so our CI server can abort change releases introducing regressions or major server failures.

Finally, running the extra mile would entail deploying the backend in a serverless platform hosting the server execution as a lambda function. Depending on the provider, and given the high recurrence of ticks and server runs, cost would be an issue though.

### 4. Mitigate application safety risk by locking dependency versioning
Project dependencies have been installed and registered using the caret (`^`) symbol, so the application will always install the latest minor version according to the package semver versioning. 

While this is fine for a POC, it might entail security risks in a production environment, where package stability and compatibility across peer dependencies are top concerns.

As a matter of habit, I usually constrain dependency picking to the greater patch version only (or even lock the full version at all) before moving into production.

### 5. Rethink current business logic for continuous alerts
This is a subject derived from my concern about not having understood the business logic requirements properly. My understanding is that the system should emit alerts after the heavy load average threshold has been exceeded for `{n}` minutes and then inform of how many times the heavy load has endured so far since the alert was triggered. This state will be enforced until the system finally recovers for the minimum period of time required for assessing recovery as final.

However, I rather inform about how many times a heavy average load alert has been emitted in the scope of the time window instead, regardless we inform (or not) about how many alerts have we sequentally emitted so far in the scope of the current ongoing alert.

Historical data might be as beneficial for metrics tracking as peeking into how many continued alerts we're getting already IMHO. Nonetheless, this might be simply a matter of me not having understood the requirements well at first. Most of the logic was implemented along the weekend so I had no one to ask before submitting the deliverables.

### 6. Rethink current business logic for recovery notifications
This suggestion comes hand in hand with the previous subject. Once the system is recovered, the recovery alert will be enforced until a new heavy CPU load is emitted. If the system remains stable for longer than the data persistence time window, it does not make sense to keep on showing off a recovery notification from a recovery that happened, let's say, 24 hours ago, for argument's sake.

I do believe the recovery notification should be exhausted once it expires according to its creation date vs the `{n}` minutes configured for the time window.

Again, this would be a matter of me not having properly understood the business logic requirements. For what it's worth, applying this alerting logic update can be done in no time given the current implementation in place.

### 7. Replace ticking progress bar to prevent unaccuracy due to racing conditions
The UI now takes a totally optimistic approach based on the happy path: users can tweak settings, a record is digested and then a ticking progress bar performs a `{n}` seconds roundtrip, just to start everything all over again.

This works seamlessly simply because we're consuming data locally and the backend response is instant, but this would not be as accurate should the backend is located elsewhere where network response times become an issue. We might wind up seeing how the progress bar roundtrip and the new incoming data rendering are not in sync.

If this scenario ever applies, the best way forward in order to mitigate confusion would be to consider another UI element that equally conveys the idea of data refreshing without the shortcomings of network delays and UI reconciliation. 

### 8. Implement full i18n support
The UI features very few text labels and also displays local times based on UTC timestamps. It would be both trivial and a big win altogether to implement full localisation support.

### 9. Provide better A11y by introducing fully responsive icons and UI
Although [Lighthouse](https://developers.google.com/web/tools/lighthouse) yields a 100% accessibility score for desktop, the application would definitely achieve a higher value by observing the following strategies:

* *Provide a more contrasted UI*, so visually impaired users can better access to its content. A good way to achieve this would be to implement a _light mode_ option, configurable by the user by means of a toggle control in the sliding settings pane.
* *Implement full viewport responsiveness*: The app now features a **very limited** responsiveness under mobile look-alike viewports. However the data would be better displayed, hence more accessible, if a fully-featured responsive layout was in place, taking advantage of the window real estate in larger resolutions to better present information but also providing a good final experience in smaller devices.
* Implement low resolution images for mobile devices, leveraging the `srcset` and `size` attributes of the `<img>` tag along with properly resized versions of the current icons catalogue.

### 10. Reorganize CSS/SASS code for easier future maintainance
Given the simplicity of the project, not much effort has been considered necessary to deliver a uber-structured set of SASS mixins, functions, maps or extends. That would have become a vulgar display of overengineering. However, an organized and well-structured foundation is paramount once the project scales. Setting up the basics, such as centralized mixin, function and helper partials would become priceless for future contributors in order to ensure a rapid onboarding while eventually mitigate code duplication.

### 11. Prevent style clashing with CSS Modules, CSS-in-JS, etc.
As a follow up on the above, scoping styling on a per component basis whereas required would mitigate code collisions to a greater extent. Industry-praised styling strategies such as _Styled Components_ or _CSS modules_, just to name a few, are good ways to achieve this.

### 12. Improve code quality and consistency with ESLint, Prettier, etc.
Code consistency is paramount, particularly when many contributors engage in the same project. This POC currently leverages the uber-basic, default linting configuration that comes already baked into CRA. However, in an enterprise environment, this basic config lacks the thoroughness required to ensure a consistent coding style across the team.

Prior to scale up this application, implementing a more comprehensive, opinionated set of `ESlint` rules would be a no-brainer. Moreover, this strategy could be perfectly compounded up by introducing code style formatting with [Prettier](https://prettier.io/).

## Distributed under the MIT License

Copyright 2021 Pablo Deeleman

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
