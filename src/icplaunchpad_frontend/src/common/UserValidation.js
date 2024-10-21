import * as yup from 'yup'; // Import the Yup library for schema validation

export const validationSchema = yup
  .object() // Define an object schema
  .shape({
    name: yup
      .string() // full_name must be a string
      .trim('Full name should not have leading or trailing spaces') // Ensures no leading or trailing spaces, with a custom error message
      .strict(true) // Enforces strict trimming: no leading/trailing spaces allowed, will cause validation errors if present
      .matches(/^[A-Za-z\s]+$/, 'Full name can only contain letters and spaces') // Ensures only letters and spaces are allowed in the name
      .test(
        'no-leading-space',
        'Full name should not start with a space',
        (value) => value && value[0] !== ' ' // Additional test to ensure the name doesn’t start with a space
      )
      .min(3, 'Full name must be at least 3 characters long') // Name should have at least 3 characters
      .max(50, 'Full name cannot be more than 50 characters long') // Maximum length is 50 characters
      .required('Full name is required'), // This field is mandatory

      username: yup
      .string() // openchat_user_name must be a string
      .required('Username is required') // Username is mandatory
      .test(
        'is-valid-username',
        "Username must be between 5 and 20 characters, contain no spaces, and only include letters, numbers, underscores, or '@'.",
        (value) => {
          const isValidLength =
            value && value.length >= 5 && value.length <= 20; // Length validation
          const isValidFormat = /^[a-zA-Z0-9_@-]+$/.test(value); // Allowed characters
          const noSpaces = !/\s/.test(value); // Ensure no spaces in username
          return isValidLength && isValidFormat && noSpaces;
        }
      ),

    // links: yup
    //   .array() // links must be an array
    //   .of(
    //     yup.object().shape({
    //       link: yup
    //         .string() // link must be a string
    //         .test(
    //           'no-leading-trailing-spaces',
    //           'URL should not have leading or trailing spaces',
    //           (value) => {
    //             return value === value?.trim(); // Ensure no leading/trailing spaces
    //           }
    //         )
    //         .test(
    //           'no-invalid-extensions',
    //           'URL should not end with .php, .js, or .txt',
    //           (value) => {
    //             const invalidExtensions = ['.php', '.js', '.txt']; // Restrict certain file types
    //             return value
    //               ? !invalidExtensions.some((ext) => value.endsWith(ext))
    //               : true;
    //           }
    //         )
    //         .test('is-website', 'Only website links are allowed', (value) => {
    //           if (value) {
    //             try {
    //               const url = new URL(value); // Parse the URL to ensure it is valid
    //               const hostname = url.hostname.toLowerCase();
    //               const validExtensions = [
    //                 '.com',
    //                 '.org',
    //                 '.net',
    //                 '.in',
    //                 '.co',
    //                 '.io',
    //                 '.gov',
    //               ];
    //               const hasValidExtension = validExtensions.some((ext) =>
    //                 hostname.endsWith(ext)
    //               ); // Ensure domain has valid extension
    //               return hasValidExtension;
    //             } catch (err) {
    //               return false; // Invalid URL
    //             }
    //           }
    //           return true; // Optional, so valid if not provided
    //         })
    //         .url('Invalid URL') // Ensures it's a valid URL format
    //         .nullable(true) // Allows null value for optional URLs
    //         .optional(), // Marks the field as optional
    //     })
    //   )
    //   .max(10, 'You can only add up to 10 links') // Limit the number of links to 10
    //   .optional(), // Links are optional

    // social_links: yup
    //   .array()
    //   .of(
    //     yup.object().shape({
    //       platform: yup.string().required('Platform is required'), // Ensures platform name is required
    //       url: yup.string().url('Invalid URL').required('URL is required'), // Validates URL and ensures it's required
    //     })
    //   )
    //   .required('Social links are required'),

    profile_picture: yup
      .mixed() // image must be a mixed type (allowing files)
      .nullable(true) // Allows null value for optional image input
      .test('fileSize', 'File size max 10MB allowed', (value) => {
        return !value || (value && value.size <= 10 * 1024 * 1024); // Ensure file size is <= 10MB
      })
      .test('fileType', 'Only jpeg, jpg & png file format allowed', (value) => {
        return (
          !value ||
          (value &&
            ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type)) // Only allow certain image formats
        );
      }),

    tag: yup
      .string() // tag must be a string
      .required('Tag is required'), // Tag is mandatory
  })
  .required(); // Ensures the entire schema is required
