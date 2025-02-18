import * as yup from "yup";

// Utility transform function
const emptyStringToNull = (value, originalValue) =>
  typeof originalValue === "string" && originalValue.trim() === "" ? null : value;

export const getSchemaForStep = (step) => {
  switch (step) {
    case 2:
      return yup.object().shape({
        FairlaunchTokens: yup
          .number()
          .transform(emptyStringToNull)
          .typeError("Enter value")
          .required("Fairlaunch Tokens is required")
          .positive("Fairlaunch Tokens must be positive")
          .notOneOf([0], "Fairlaunch Tokens must be greater than 0")
          .test(
            "is-less-than-or-equal-to-total_supply",
            "Tokens for Fairlaunch must not exceed the total supply",
            function (value) {
              console.log('this.parent=',this.parent)
              const {total_supply} = this.parent;
              console.log('total_supply--',total_supply)
              return value <= Number(total_supply || 0); // Safely handle total_supply as a number
            }),

        softcapToken: yup
          .number()
          .transform(emptyStringToNull)
          .typeError("Enter value")
          .required("Softcap token is required")
          .positive("Softcap token must be greater than 0"),

        hardcapToken: yup
          .number()
          .transform(emptyStringToNull)
          .typeError("Enter value")
          .required("Hardcap token is required")
          .positive("Hardcap token must be positive")
          .test(
            "is-greater-or-equal",
            "Hardcap token must be greater than or equal to Softcap token",
            function (value) {
              const { softcapToken } = this.parent;
              return value >= softcapToken;
            }
          ),

        liquidityPercentage: yup
          .number()
          .transform(emptyStringToNull)
          .typeError("Enter value")
          .required("Liquidity percentage is required")
          .min(51, "Liquidity percentage cannot be less than 51")
          .max(100, "Liquidity percentage cannot be greater than 100"),

        minimumBuy: yup
          .number()
          .transform(emptyStringToNull)
          .typeError("Enter value")
          .required("Minimum contribution is required")
          .positive("Minimum contribution must be positive")
          .notOneOf([0], "Minimum contribution cannot be 0"),

        maximumBuy: yup
          .number()
          .transform(emptyStringToNull)
          .typeError("Enter value")
          .required("Maximum contribution is required")
          .positive("Maximum contribution must be positive")
          .notOneOf([0], "Maximum contribution cannot be 0")
          .moreThan(
            yup.ref("minimumBuy"),
            "Maximum contribution must be greater than minimum contribution"
          ),

        startTime: yup
          .date()
          .typeError("Start time must be a valid date")
          .required("Start time is required")
          .min(new Date(), "Start time must be in the future"),

        endTime: yup
          .date()
          .typeError("End time must be a valid date")
          .required("End time is required")
          .min(yup.ref("startTime"), "End time must be after the start time")
          .test(
            "is-at-least-one-minute-later",
            "End time should be at least one minute after the start time",
            function (value) {
              const { startTime } = this.parent;
              return (
                startTime &&
                value &&
                new Date(value).getTime() >= new Date(startTime).getTime() + 60000
              );
            }
          ),


        logoURL: yup
          .mixed()
          .test("fileSize", "File size max 10MB allowed", (value) => {
            return !value || (value && value.size <= 10 * 1024 * 1024);
          })
          .test("fileType", "Only jpeg, jpg & png file format allowed", (value) => {
            return (
              !value ||
              (value && ["image/jpeg", "image/jpg", "image/png"].includes(value.type))
            );
          })
          .nullable(true),
      });

    case 3:
      return yup.object().shape({
        description: yup
          .string()
          .required("Description is required")
          .test(
            "wordCount",
            "Description must be 300 words or less",
            (value) => value && value.split(" ").length <= 300
          ),

        website: yup
          .string()
          .required("Website is required")
          .matches(
            /^(http:\/\/|https:\/\/).+/,
            "Website must start with http:// or https://"
          )
          .url("Website must be a valid URL"),

          project_video: yup
          .string()
          .required("Project video is required")
          .url("Project video must be a valid URL")
          .matches(
            /\.(mp4|avi|mov|wmv|flv|mkv)$/i,
            "Project video must be a valid video URL ending with .mp4, .avi, .mov, .wmv, .flv, or .mkv"
          ),
          social_links: yup
          .array()
          .of(
            yup
              .string()
              .url("Each link must be a valid URL.") // Ensure the string is a valid URL
              .min(10, "Each link must be at least 10 characters long.") // Enforce minimum length
              .max(100, "Each link can be at most 100 characters long.") // Enforce maximum length
          )
          .min(1, "You must provide at least 1 link.") // Require at least one link
          .max(5, "You can provide up to 5 links.") // Restrict to 5 links maximum
          .nullable(), // Allow the array itself to be null
                
      });

    default:
      return yup.object().shape({});
  }
};