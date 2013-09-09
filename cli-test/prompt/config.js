/**
 * @fileOverview
 * I like to use js files for config rather than JSON because you can comments in JS files. :)
 * This file stores the inputs and outputs for the prompt_test.js and is used by drv_prompt_test.js
 * to run the test.
 */

exports.strings = {
  output: {
    namePrompt: "Please enter your: [90mfull name [39m[90m: [39m ",
    emailPrompt: "Please enter your: [90memail address[39m[90m: [39m ",
    passwordPrompt: "Please enter your: [90mpassword[39m[90m: [39m ",
    password2Prompt: "Please enter your: [90mpassword again for confirmation[39m[90m: [39m ",
    data: "{\"name\":\"E. L. Meinfelder\",\"email\":\"elmeinfelder@gmail.com\",\"password\":\"12345678\"}\n",
  },
  input: {
    name: "E. L. Meinfelder\n",
    email: "elmeinfelder@gmail.com\n",
    password: "12345678\n",
  },
}

