import * as yup from "yup";

// Token Validation schema using Yup
export const getSchemaForStep = (step) => {
    switch (step) {
      case 2:
        return yup.object().shape({
            presaleRate: yup
              .number()
              .transform((value, originalValue) => (originalValue.trim() === "" ? null : value)) // Convert empty string to null
              .typeError("Enter value") // Custom error message when value is not a valid number
              .required("Presale rate is required") // Error when value is null or undefined
              .positive("Presale rate must be positive")
              .notOneOf([0], "Presale rate cannot be 0"),
          
          minimumBuy: yup
            .number()
            .transform((value, originalValue) => (originalValue.trim() === "" ? null : value)) // Convert empty string to null
            .typeError("Enter value") // Custom error message when value is not a valid number
            .required("Minimum buy is required")
            .positive("Minimum buy must be positive")
            .notOneOf([0], "Minimum buy cannot be 0"),
          maximumBuy: yup
            .number()
            .transform((value, originalValue) => (originalValue.trim() === "" ? null : value)) // Convert empty string to null
            .typeError("Enter value") // Custom error message when value is not a valid number
            .required("Maximum buy is required")
            .positive("Maximum buy must be positive")
            .notOneOf([0], "Maximum buy cannot be 0")
            .moreThan(
              yup.ref("minimumBuy"),
              "Maximum buy must be greater than minimum buy"
            ),
          startTime: yup
            .date()
            .required("Start time is required")
            .min(new Date(), "Start time must be in the future"),
          endTime: yup
            .date()
            .required("End time is required")
            .min(
              yup.ref("startTime"),
              "End time should be after the start time"
            )
            .test(
              "is-at-least-one-minute-later",
              "End time should be at least one minute after the start time",
              function (value) {
                const { startTime } = this.parent;
                if (startTime && value) {
                  return value.getTime() >= new Date(startTime).getTime() + 60000;
                }
                return true;
              }
            ),
          social_links: yup
            .array()
            .of(
              yup.object().shape({
                link: yup
                  .string()
                  .test(
                    'no-leading-trailing-spaces',
                    'URL should not have leading or trailing spaces',
                    (value) => {
                      return value === value?.trim();
                    }
                  )
                  .test(
                    'no-invalid-extensions',
                    'URL should not end with .php, .js, or .txt',
                    (value) => {
                      const invalidExtensions = ['.php', '.js', '.txt'];
                      return value
                        ? !invalidExtensions.some((ext) => value.endsWith(ext))
                        : true;
                    }
                  )
                  .test('is-website', 'Only website links are allowed', (value) => {
                    if (value) {
                      try {
                        const url = new URL(value);
                        const hostname = url.hostname.toLowerCase();
                        const validExtensions = [
                          '.com',
                          '.org',
                          '.net',
                          '.in',
                          '.co',
                          '.io',
                          '.gov',
                        ];
                        const hasValidExtension = validExtensions.some((ext) =>
                          hostname.endsWith(ext)
                        );
                        return hasValidExtension;
                      } catch (err) {
                        return false;
                      }
                    }
                    return true;
                  })
                  .url('Invalid URL')
                  .nullable(true)
                  .optional(),
              })
            )
            .max(10, 'You can only add up to 10 links') // Restrict the array to a maximum of 10 links
            .optional(),
          // Image Validation
          logoURL: yup
            .mixed()
            .nullable(false)
            .test("fileSize", "File size max 10MB allowed", (value) => {
              return !value || (value && value.size <= 10 * 1024 * 1024);
            })
            .test("fileType", "Only jpeg, jpg & png file format allowed", (value) => {
              return (
                !value ||
                (value && ["image/jpeg", "image/jpg", "image/png"].includes(value.type))
              );
            }),
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
        });
      default:
        return yup.object().shape({});
    }
  };