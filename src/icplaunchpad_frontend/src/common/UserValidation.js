import * as yup from "yup"; // Import the Yup library for schema validation

export const validationSchema = yup
  .object() // Define an object schema
  .shape({
    name: yup
      .string() // Name must be a string
      .trim("Full name should not have leading or trailing spaces") // No leading/trailing spaces
      .strict(true) // Enforces strict trimming
      .matches(/^[A-Za-z\s]+$/, "Full name can only contain letters and spaces") // Only letters and spaces allowed
      .test(
        "no-leading-space",
        "Full name should not start with a space",
        (value) => value && value[0] !== " " // Test to ensure no leading space
      )
      .min(3, "Full name must be at least 3 characters long") // Minimum 3 characters
      .max(50, "Full name cannot be more than 50 characters long") // Maximum 50 characters
      .required("Full name is required"), // Required field

    username: yup
      .string() // Username must be a string
      .required("Username is required") // Required field
      .test(
        "is-valid-username",
        "Username must be between 5 and 20 characters, contain no spaces, and only include letters, numbers, underscores, or '@'.",
        (value) => {
          const isValidLength =
            value && value.length >= 5 && value.length <= 20;
          const isValidFormat = /^[a-zA-Z0-9_@-]+$/.test(value); // Alphanumeric, underscores, '@'
          const noSpaces = !/\s/.test(value); // No spaces allowed
          return isValidLength && isValidFormat && noSpaces;
        }
      ),

    profile_picture: yup
      .mixed() // Allows mixed type (files)
      .nullable(true) // Optional (nullable)
      .test("fileSize", "File size max 10MB allowed", (value) => {
        return !value || (value && value.size <= 10 * 1024 * 1024); // Max 10MB size
      })
      .test("fileType", "Only jpeg, jpg & png file format allowed", (value) => {
        return (
          !value ||
          (value &&
            ["image/jpeg", "image/jpg", "image/png"].includes(value.type))
        );
      }),

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
    // Social links (if needed, uncomment)
    links: yup
      .array()
      .of(
        yup
          .string()
          .min(10, "Each link must be at least 1 character long.")
          .max(20, "Each tag can be at most 20 characters long.")
      )
      .min(1, "You must provide at least 1 link.")
      .max(10, "You can provide up to 5 link.")
      .required("links are required."),
  });
