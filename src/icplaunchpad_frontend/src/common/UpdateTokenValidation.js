import * as yup from "yup"; // Import the Yup library for schema validation

export const UpdateTokenValidationSchema = yup.object().shape({
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
      
      start_time_utc: yup
      .date()
      .typeError("Start time must be a valid date")
      .required("Start time is required"),
     

      end_time_utc: yup
      .date()
      .typeError("End time must be a valid date")
      .required("End time is required")
      .min(new Date(), "end time must be in the future")
      
  });
