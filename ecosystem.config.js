module.exports = {
  apps : [{
    "name": "cir3-app-client",
    "cwd": "./front",
    script: "npm",
    "args": "start"
  }, {
    "name": "cir3-app-server",
    "cwd": "./back",
    script: "npm",
    "args": "start"
  }],
};
