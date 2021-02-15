const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const APP_BUCKET = `${process.env.S3_APP_BUCKET}`;

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
  });
  
const s3 = new AWS.S3();

const isJSON = (supJ) => {
    try {
      JSON.parse(supJ);
      return true;
    } catch (err) {
      return false;
    }
  };

const bucketActions = ({
    action,
    subBucket,
    Body,
    returnKey,
    returnParsedBody,
    emptyBucketFailsafe,
    optionalParams,
  }) => {
    return new Promise(async (resolve, reject) => {
      const Body_ = await Promise.resolve(
        Body ? { Body: isJSON(Body) ? Body : JSON.stringify(Body) } : {}
      );
  
      // S3 params
      const Key = await Promise.resolve(
        action !== "listObjects" ? { Key: subBucket } : {}
      );
      let params;
  
      params = await Promise.resolve({
        Bucket: APP_BUCKET,
        //Key : subBucket, // 'CHANGEDEMAILS/'+process.env.CHANGEDMAILS_SECRET
        ...Key,
        ...Body_,
        ...(optionalParams || {}),
      });
  
      try {
        s3[action == "getObjectApi" ? "getObject" : action](
          params,
          async (err, data) => {
            if (err) {
              if (err.code === "NoSuchKey") {
                console.warn(
                  `bucketActions -> s3[${action}] ERROR code "noSuchKey". resolving`,
                  emptyBucketFailsafe
                );
                resolve(emptyBucketFailsafe || {});
              } else {
                console.error("db getChangedEmails S3.getObject ERROR", err);
                reject(err);
              }
            } else {
              const result = await Promise.resolve(
                (data && data.Body && data.Body.toString()) ||
                  emptyBucketFailsafe ||
                  "{}"
              );
              const parsedBody = await Promise.resolve(
                isJSON(result) ? JSON.parse(result) : result
              );
              const data_ = await Promise.resolve(
                returnParsedBody ? parsedBody : data
              );
  
              resolve(returnKey ? { data: data_, key: params.Key } : data_);
            }
          }
        );
      } catch (err) {
        console.error(`bucketActions ${action} ERROR`, err);
        resolve({});
      }
      //res(list);
    });
  };

const database = {
    natures : {
        get: ({ body }) =>
        new Promise(async (resolve, reject) => {
          try {
    
            const params = await Promise.resolve({
              action: "getObject",
              subBucket: `CORE_PARAMETERS/natures_${body.category}_${body.language}.json`,
              returnParsedBody: true,
              emptyBucketFailsafe: [],
            });
    
            const _natures = await bucketActions(params);
    
            resolve(_natures);
    
          } catch (e) {
            console.error("natures.get ERROR", e);
            reject(e);
          }
        })
      },
      naturesFeatures : {
        get: ({ body }) =>
        new Promise(async (resolve, reject) => {
          try {
    
            const params = await Promise.resolve({
              action: "getObject",
              subBucket: `CORE_PARAMETERS/naturesFeatures_${body.category}_${body.language}.json`,
              returnParsedBody: true,
              emptyBucketFailsafe: [],
            });
    
            const _naturesFeatures = await bucketActions(params);
    
            resolve(_naturesFeatures);
    
          } catch (e) {
            console.error("naturesFeatures.get ERROR", e);
            reject(e);
          }
        })
      },
}

module.exports = database;