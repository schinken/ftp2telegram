# ftp2telegram

<div align="center">
    <img src="https://github.com/schinken/ftp2telegram/blob/master/assets/ftp2telegram.svg" width="800" alt="valetudo">
    <p align="center"><h2>Free your vacuum from the cloud</h2></p>
</div>

A standalone FTP Server forwarding everything to Telegram Chats/Groups

## Introduction

There are quite a few (both legacy as well as recent) devices which support FTP as the lowest common denominator for remote data exchange.
Examples of these devices include Scanners (Scan to FTP), more-or-less Smart Doorbells and other appliances.

Problem is: FTP is terrible. 
Hard to configure. Even harder to secure. ASCII Mode(???)

Therefore, the idea is to simply use the least amount of FTP possible and forward everything to better protocols/means of data consumption.

## Description

ftp2telegram is a standalone FTP server which accepts images, animations, videos, audios or even documents uploaded and forwards them to
the Telegram Chat-IDs configured in the configuration.

Uploads only reside in memory which is much cleaner than running a regular FTP-Server and watching the upload directory with inotify or something like that.

# Getting started

TBD
