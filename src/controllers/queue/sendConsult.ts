import amqp from "amqplib/callback_api";
import { Request, Response } from "express";
import fs from "fs";

export const sendConsultToQueue = async (
  request: Request,
  response: Response
) => {
  const { consult } = request.body;

  amqp.connect("amqp://localhost", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      var queue = "hello";

      // var msg = "Hello World!sd";

      channel.assertQueue(queue, {
        durable: true,
      });
      addNewConsultTime();
      getTimeToSendConsult(channel, queue, consult);
    });
    // setTimeout(function () {
    //   connection.close();
    //   process.exit(0);
    // }, 500);
  });

  return response.status(200).json({ status: "success", consult });
};

const getTimeToSendConsult = (channel: any, queue: any, message: any) => {
  fs.readFile("./queueConsult.json", "utf-8", function (err: any, obj: any) {
    obj = JSON.parse(obj);
    let lastConsultTime = {
      hour: Number(obj.lastRequest.slice(0, 2)),
      minutes: Number(obj.lastRequest.slice(3, 5)),
    };
    let currentHour = {
      hour: new Date().getHours(),
      minutes: new Date().getMinutes(),
    };

    let setTimeOut = 0;

    if (currentHour.hour > lastConsultTime.hour) {
      setTimeOut = 0;
    } else if (currentHour.minutes - lastConsultTime.minutes > 2) {
      setTimeOut = 0;
    }

    // Add a delay based on lastConsultTime
    else {
      setTimeOut =
        (currentHour.minutes - lastConsultTime.minutes) * (1000 * 60) +
        1000 * 60;
    }

    console.log("setTimeOut", setTimeOut);
    setTimeout(() => {
      channel.sendToQueue(queue, Buffer.from(message));
    }, setTimeOut);

    //console.table({ last: lastConsultTime, current: currentHour });
  });
};

const addNewConsultTime = async () => {
  var jsonFile: any = null;

  fs.readFile("./queueConsult.json", "utf-8", function (err: any, obj: any) {
    jsonFile = JSON.parse(obj);

    let lastConsultTime = {
      hour: Number(jsonFile.lastRequest.slice(0, 2)),
      minutes: Number(jsonFile.lastRequest.slice(3, 5)),
    };

    let currentHour = {
      hour: new Date().getHours(),
      minutes: new Date().getMinutes(),
    };

    console.table({
      last: lastConsultTime,
      currentHour: currentHour,
    });

    if (currentHour.hour > lastConsultTime.hour) {
      console.log("maior", currentHour);

      jsonFile = {
        ...jsonFile,
        lastRequest: `${currentHour.hour}:${currentHour.minutes}`,
      };
    } else if (currentHour.minutes - lastConsultTime.minutes > 2) {
      console.log("aaaaa");

      jsonFile = {
        ...jsonFile,
        lastRequest: `${currentHour.hour}:${currentHour.minutes}`,
      };
    } else if (currentHour.minutes - lastConsultTime.minutes < 2) {
      console.log("bbbbbb");

      currentHour.minutes = currentHour.minutes + 1;
    }

    // verify if currentMinutes is equal or biggest than 60

    if (currentHour.minutes >= 60) {
      console.log("cccc");

      currentHour.minutes = currentHour.minutes % 60;
      currentHour.hour = currentHour.hour + 1;
    }

    // console.table({
    //   last: lastConsultTime,
    //   currentHour: currentHour,
    // });

    let tmpMinutes =
      currentHour.minutes > 9 ? currentHour.minutes : `0${currentHour.minutes}`;

    console.log("tmpMinues", tmpMinutes);

    jsonFile = {
      ...jsonFile,
      lastRequest: `${currentHour.hour}:${tmpMinutes}`,
    };

    console.log("ddddddddd", JSON.stringify(jsonFile));
    // JSON.stringify(jsonFile);

    fs.writeFile(
      "./queueConsult.json",
      JSON.stringify(jsonFile),
      "utf-8",
      (err) => {
        if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
        }
        console.log("JSON file has new lastRequestHour hour");
      }
    );
  });
};
