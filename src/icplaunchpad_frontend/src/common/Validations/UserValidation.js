import * as yup from "yup"; // Import the Yup library for schema validation

export const validationSchema = yup
  .object() // Define an object schema
  .shape({
    name: yup
      .string() // full_name must be a string
      .trim("Full name should not have leading or trailing spaces") // Ensures no leading or trailing spaces, with a custom error message
      .strict(true) // Enforces strict trimming: no leading/trailing spaces allowed, will cause validation errors if present
      .matches(/^[A-Za-z\s]+$/, "Full name can only contain letters and spaces") // Ensures only letters and spaces are allowed in the name
      .test(
        "no-leading-space",
        "Full name should not start with a space",
        (value) => value && value[0] !== " " // Additional test to ensure the name doesn’t start with a space
      )
      .min(3, "Full name must be at least 3 characters long") // Name should have at least 3 characters
      .max(50, "Full name cannot be more than 50 characters long") // Maximum length is 50 characters
      .required("Full name is required"), // This field is mandatory

    username: yup
      .string() // openchat_user_name must be a string
      .required("Username is required") // Username is mandatory
      .test(
        "is-valid-username",
        "Username must be between 5 and 20 characters, contain no spaces, and only include letters, numbers, underscores, or '@'.",
        (value) => {
          const isValidLength =
            value && value.length >= 5 && value.length <= 20; // Length validation
          const isValidFormat = /^[a-zA-Z0-9_@-]+$/.test(value); // Allowed characters
          const noSpaces = !/\s/.test(value); // Ensure no spaces in username
          return isValidLength && isValidFormat && noSpaces;
        }
      ),

    links: yup
      .array()
      .of(
        yup
          .string()
          .url("Each link must be a valid URL.") // Validate as a proper URL
          .min(10, "Each link must be at least 10 characters long.") // Minimum length validation
          .max(100, "Each link can be at most 100 characters long.") // Maximum length validation
      )
      .min(1, "You must provide at least 1 link.") // Require at least 1 link
      .max(5, "You can provide up to 5 links.") // Limit to 5 links
      .notRequired(), // Links array is optional


    profile_picture: yup
      .mixed() // image must be a mixed type (allowing files)
      .nullable(true) // Allows null value for optional image input
      .test("fileSize", "File size max 10MB allowed", (value) => {
        return !value || (value && value.size <= 10 * 1024 * 1024); // Ensure file size is <= 10MB
      })
      .test("fileType", "Only jpeg, jpg & png file format allowed", (value) => {
        return (
          !value ||
          (value &&
            ["image/jpeg", "image/jpg", "image/png"].includes(value.type)) // Only allow certain image formats
        );
      }),

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
            

    tags: yup
      .array()
      .of(
        yup
          .string()
          .min(1, "Each tag must be at least 1 character long.")
          .max(20, "Each tag can be at most 20 characters long.")
      )
      .min(1, "You must provide at least 1 tag.")
      .max(5, "You can provide up to 5 tags.")
      .required("Tags are required."),
  });
