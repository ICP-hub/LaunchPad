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
          .notOneOf([0], "Fairlaunch Tokens must be greater than 0"),

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
          .min(0, "Liquidity percentage cannot be less than 0")
          .max(100, "Liquidity percentage cannot be greater than 100"),

          tokensLiquidity: yup
          .number()
          .transform(emptyStringToNull)
          .typeError("Enter value")
          .required("Tokens for liquidity is required")
          .positive("Tokens for liquidity must be positive")
          .notOneOf([0], "Tokens for liquidity must be greater than 0")
          .test(
            "is-less-than-or-equal-to-fairlaunch",
            "Tokens for liquidity must not exceed the tokens allocated for the fairlaunch",
            function (value) {
              const { FairlaunchTokens } = this.parent;
              return value <= FairlaunchTokens;
            }
          ),


        minimumBuy: yup
          .number()
          .transform(emptyStringToNull)
          .typeError("Enter value")
          .required("Minimum buy is required")
          .positive("Minimum buy must be positive")
          .notOneOf([0], "Minimum buy cannot be 0"),

        maximumBuy: yup
          .number()
          .transform(emptyStringToNull)
          .typeError("Enter value")
          .required("Maximum buy is required")
          .positive("Maximum buy must be positive")
          .notOneOf([0], "Maximum buy cannot be 0")
          .moreThan(
            yup.ref("minimumBuy"),
            "Maximum buy must be greater than minimum buy"
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

        social_links: yup
          .array()
          .of(
            yup.object().shape({
              link: yup
                .string()
                .test(
                  "no-leading-trailing-spaces",
                  "URL should not have leading or trailing spaces",
                  (value) => value === value?.trim()
                )
                .test(
                  "no-invalid-extensions",
                  "URL should not end with .php, .js, or .txt",
                  (value) => {
                    const invalidExtensions = [".php", ".js", ".txt"];
                    return value
                      ? !invalidExtensions.some((ext) => value.endsWith(ext))
                      : true;
                  }
                )
                .test("is-website", "Only website links are allowed", (value) => {
                  if (value) {
                    try {
                      const url = new URL(value);
                      const hostname = url.hostname.toLowerCase();
                      const validExtensions = [
                        ".com",
                        ".org",
                        ".net",
                        ".in",
                        ".co",
                        ".io",
                        ".gov",
                      ];
                      return validExtensions.some((ext) =>
                        hostname.endsWith(ext)
                      );
                    } catch (err) {
                      return false;
                    }
                  }
                  return true;
                })
                .url("Invalid URL")
                .nullable(true),
            })
          )
          .max(10, "You can only add up to 10 links")
          .optional(),

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
          .matches(
            /^(http:\/\/|https:\/\/).+/,
            "Project video must start with http:// or https://"
          )
          .url("Project video must be a valid URL"),
      });

    default:
      return yup.object().shape({});
  }
};
