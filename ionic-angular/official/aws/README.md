# Ionic AWS Starter

This Ionic starter comes with a pre-configured [AWS Mobile Hub](https://aws.amazon.com/mobile/) project set up to use Amazon DynamoDB, S3, Pinpoint, and Cognito.

## Using the Starter

### Installing Ionic CLI 3.0

This starter project requires Ionic CLI 3.0, to install, run

```bash
npm install -g ionic@latest
```

Make sure to add `sudo` on Mac and Linux. If you encounter issues installing the Ionic 3 CLI, uninstall the old one using `npm uninstall -g ionic` first.

### Installing AWSMobile CLI

```
npm install -g awsmobile-cli
```

### Creating the Ionic Project

To create a new Ionic project using this AWS Mobile Hub starter, run

```bash
ionic start myApp aws
```

Which will create a new app in `./myApp`.

Once the app is created, `cd` into it:

```bash
cd myApp
```

### Creating AWS Mobile Hub Project

Init AWSMobile project 

```bash
awsmobile init

Please tell us about your project:
? Where is your project's source directory:  src
? Where is your project's distribution directory that stores build artifacts:  www
? What is your project's build command:  npm run-script build
? What is your project's start command for local test run:  ionic serve

? What awsmobile project name would you like to use:  ...

Successfully created AWS Mobile Hub project: ...
```

### Configuring AWS Mobile Hub Project

The starter project gives instructions on how to do this from the
command line, but some have reported bugs with
[awsmobile](https://github.com/ionic-team/starters/issues/46),
so here's how to do it in the browser.

#### NoSQL Database

Enable.

Create a custom table named `tasks`. Make it Private.

Accept `userId` as Partition key.

Add an attribute `taskId` with type string and make it a Sort key

Add an attribute `category` with type string.

Add an attribute `description` with type string.

Add an attribute `created` with type number.

Create an index `DateSorted` with userId as Partition key and taskId
as Sort key.

#### User Sign-In

Turn this on.

Set your password requirements.


#### Hosting and Streaming

Turn this on.

#### User File Storage

Turn this on.

### Configuring S3

From the AWS Console, go to S3.

Select the bucket named `<project name>-userfiles-mobilehub-<AWS resource number>`

Go to the Permissions tab. Click on CORS Configuration. Paste the
following into the editor and save.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>GET</AllowedMethod>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
    <ExposeHeader>x-amz-server-side-encryption</ExposeHeader>
    <ExposeHeader>x-amz-request-id</ExposeHeader>
    <ExposeHeader>x-amz-id-2</ExposeHeader>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```


### Integrating Changes into App

Go back to the command line for your project.

```bash
awsmobile pull
```

Answer yes, when asked "? sync corresponding contents in backend/ with #current-backend-info/"

### Install dependencies


```bash
npm install
```

The following commands are needed due to breaking changes in
[aws-amplify](https://github.com/aws/aws-amplify) 0.4.6.
They may not be needed in the future.

```bash
npm install @types/zen-observable
npm install @types/paho-mqtt
```

### Running the app

Now the app is configured and wired up to the AWS Mobile Hub and AWS services. To run the app in the browser, run

```bash
ionic serve
```

To run the app on device, first add a platform, and then run it:

```bash
ionic cordova platform add ios
ionic cordova run ios
```

Or open the platform-specific project in the relevant IDE:

```bash
open platforms/ios/MyApp.xcodeproj
```

### Hosting app on Amazon S3

Since your Ionic app is just a web app, it can be hosted as a static website in an Amazon S3 bucket.

```
npm run build
awsmobile publish
```
