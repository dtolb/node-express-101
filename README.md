# node-express-101

This is a basic application that makes phone calls and speaks a sentence to a phone number.

## Prereqs

* [Bandwidth Account](http://dev.bandwidth.com)
* [ngrok](http://ngrok.io) (or similar)
* [Node v6+](https://nodejs.org/en/)

## Running the example

### Env Vars

Be sure that the following environment variables are set. Learn how to set [envirnoment variables](https://www.schrodinger.com/kb/1842)

| Varaible                 | Descirption                                              | Example                |
|:-------------------------|:---------------------------------------------------------|:-----------------------|
| `BANDWIDTH_PHONE_NUMBER` | Your bandwidth phone number to create the calls **FROM** | `+19197771111`         |
| `BANDWIDTH_USER_ID`      | Your bandwidth **API** user-id                           | `u-123acbas3k3459c`    |
| `BANDWIDTH_API_TOKEN`    | Your bandwidth API token                                 | `t-abc123asdg390856c`  |
| `BANDWIDTH_API_SECRET`   | Your bandwidth API secret                                | `abd1239890alkjc90385` |


### Launch ngrok

[Ngrok](https://ngrok.com) is an awesome tool that lets you open up local ports to the internet.

![Ngrok how](https://ngrok.com/static/img/demo.png)

Once you have ngrok installed, open a new terminal tab and navigate to it's location on the file system and run:

```bash
$ cd ~/Downloads/
$ ./ngrok http 3000
```

You'll see the terminal show you information

![ngrok terminal](https://github.com/BandwidthExamples/masked-number-api/blob/master/readme_images/ngrok_terminal.png?raw=true)

Copy the `http://8a543f5f.ngrok.io` link and save it for later

### Install and launch the app

```bash
npm install
npm start
```

### Create the call

To create a call, we have to create a `POST` request to the service:

```http
POST http://8a543f5f.ngrok.io/create-call

{
  "phoneNumber": "+19192223333"
}

201 Created
{
  "from"        : "+17079311113",
  "to"          : "+19197891146",
  "callbackUrl" : "http://8a543f5f.ngrok.io/outbound-callbacks",
  "id"          : "c-abc23"
}

```

### Sample Curl

```bash
curl -v POST http://8a543f5f.ngrok.io/create-call \
    -H "Content-type: application/json" \
    -d \
    '
    {
        "phoneNumber" : "+19192223333"
    }'
```
