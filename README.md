# node-express-101

This is an app that uses express and Bandwidth to auto-respond to incoming texts and calls.

## Pre-Reqs

* [Bandwidth Account](https://app.bandwidth.com)
* [NodeJS v8+](https://nodejs.org/en/)
* [Ngrok (or similar)](https://ngrok.com/) to receive callbacks

## Env Variables

This application requires a few environment variables

| Env Var                  | Description                          | Example        |
|:-------------------------|:-------------------------------------|:---------------|
| `BANDWIDTH_PHONE_NUMBER` | Phone number to send calls and texts | `+19198281234` |
| `BANDWIDTH_USER_ID`      | Your API UserId                      | `u-abc123`     |
| `BANDWIDTH_API_TOKEN`    | Your API Token                       | `t-abc123`     |
| `BANDWIDTH_API_SECRET`   | Your API Secret                      | `abc123`       |

