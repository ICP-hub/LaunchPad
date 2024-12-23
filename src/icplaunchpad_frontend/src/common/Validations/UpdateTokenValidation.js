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
          .url("Project video must be a valid URL")
          .matches(
            /\.(mp4|avi|mov|wmv|flv|mkv)$/i,
            "Project video must be a valid video URL ending with .mp4, .avi, .mov, .wmv, .flv, or .mkv"
          ),
      
      start_time_utc: yup
      .date()
      .typeError("Start time must be a valid date")
      .required("Start time is required"),
     

      end_time_utc: yup
      .date()
      .typeError("End time must be a valid date")
      .required("End time is required")
      .min(new Date(), "end time must be in the future"),
   
      links: yup
      .array()
      .of(
          yup
              .string()
              .url('Each link must be a valid URL.')
              .min(10, 'Each link must be at least 10 characters long.')
              .max(100, 'Each link can be at most 100 characters long.')
      )
      .max(5, 'You can provide up to 5 links.') // Limit to 5 links
      .optional(), // Make the array optional
    
  
      
  });
