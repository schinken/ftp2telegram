# ftp2telegram

A standalone FTP Server forwarding everything to Telegram Chats/Groups

## Introduction

There are quite a few (both legacy as well as recent) devices which support FTP as the lowest common denominator for remote data exchange.<br/>
Examples of these devices include Scanners (Scan to FTP), more-or-less Smart Doorbells and other appliances.

Problem is: FTP is terrible.<br/>
Hard to configure. Even harder to secure. ASCII Mode(???)

Therefore, the idea is to simply use the least amount of FTP possible and forward everything to better protocols/means of data consumption.

## Description

ftp2telegram is a standalone FTP server which accepts images, animations, videos, audios or even documents uploaded and forwards them to
the Telegram Chat-IDs configured.

Uploads only reside in memory which is much cleaner than running a regular FTP-Server and watching the upload directory with inotify or something like that.

## Getting started

You can either run ftp2telegram directly or use the provided `Dockerfile`.<br/>
In both cases, you will first need to check out this repository and copy the `config/default.js` to `config/production.js` while also of course editing it for your setup.

If you're using docker, you'll know how to use docker.

If you're running it locally, you'll need to do the usual nodejs foo:

```
npm install
npm run start
```

To keep ftp2telegram running continuously as a service, you can take a look at the basic SystemD unit file, which can be found in `deployment/systemd`.




