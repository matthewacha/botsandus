# Documentation

This is a basic documentation for the UI application

### Running test
E2E tests have been included to ensure the stability of the system. To run tests:

```
    npm run test:e2e

```

Make sure the server is running.

```
    npm run dev

```

The test cases included are:

- A user should be able to input X-axis, Y axis and radian angle values

- A user should be able to submit these values by click or keyboard(press enter) events

- The values submitted by a user should be reflected by what the server returns

- The user can hover over the map and select a pose by clicking

- The online/offline state of the robot stream should be shown to the user

- A user should see the paused/unpaused state of the robot

### UI design patterns and implementation decisions:

The components are designed using the atomic pattern, all files pertaining to a component are included in the same folder except for the tests. 
Tests are in a separate folder called `playwright`.

**Supported devices:**

The application is built to support both touch and desktop devices. The responsiveness of the UI is tailored for the following:

- Ipad Mini

- Ipad Air

- Surface Pro 7

- Nest HubMax

The application will function just fine in other touch devices, but may not look as appealing. 

Due to time constraint, some device reponsiveness was overlooked for functionality

**Rendering tool**

For better performance of the application, canvas was used to render the robot position and warehouse map in real time. This decision was made to ensure a high performance.

**E2E Test choice**

I chose to use end to end testing so as to mimic user behavior. Playwright was used due to its extensive documentation, and relative stability with respect to flaky tests.
Its API also makes it easy to test websockets.


## Limitations of the system

 **Responsiveness**

Currently the UI is only design to respond to certain screen sizes as mentioned above. This is also meant to target the most commonly used devices for warehouse owners, personel etc.

**Performance**

The warehouse map was implemented using canavs. Even though canvas comes with advantages over using DOM manipulation, e.g. since canvas directly deals with pixels instead of having to go through the browser engine that first has to redraw the DOM nodes then paint to the screen. 
A better option to this would be the use of webGL 2d engine which due to less encapsulation as compare to canvas, delivers higher performance

**Angle changing by mouse interaction**

At the moment, a user is able to hover and pick a point on the map using a mouse/touch. However, the are not able to change the angle in which the robot faces. I would suggest adding a `mousemove` event while checking if the left button is held down (buttons attribute of the event). Then using the current location of the robot and calculating the radian angle of the mouse/touch point from the position of the robot. this would enable users, especially with touch devices to easily reposition the robot, since it will rotate based on their finger position on the screen.


