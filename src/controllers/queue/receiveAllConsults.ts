import amqp from "amqplib/callback_api";
import fs from "fs";

export const receiveAllConsults = () => {
  amqp.connect("amqp://localhost", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      var queue = "hello";

      channel.assertQueue(queue, {
        durable: true,
      });

      console.log(
        " [*] Waiting for messages in %s. To exit press CTRL+C",
        queue
      );

      channel.consume(
        queue,
        function (msg) {
          var jsonFile: any = null;

          fs.readFile(
            "./queueConsult.json",
            "utf-8",
            function (err: any, obj: any) {
              jsonFile = JSON.parse(obj);

              let newJson = { ...jsonFile, consult: msg?.content.toString() };
              var jsonString = JSON.stringify(newJson);

              fs.writeFile(
                "./queueConsult.json",
                jsonString,
                "utf-8",
                (err) => {
                  if (err) {
                    console.log(
                      "An error occured while writing JSON Object to File."
                    );
                    return console.log(err);
                  }
                  console.log("JSON file has been saved.");
                }
              );

              console.log(" [x] Received %s", msg?.content.toString());
            }
          );
        },
        {
          noAck: false,
        }
      );
    });
  });
};
