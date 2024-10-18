import * as yup from 'yup'; // Import the Yup library for schema validation

export const validationSchema = yup
  .object() // Define an object schema
  .shape({
    full_name: yup
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

    email: yup
      .string() // email must be a string
      .trim('Email should not have leading or trailing spaces') // Ensures no leading or trailing spaces for email
      .required('Email is required') // Email is mandatory
      .matches(
        /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/,
        'Invalid Email format' // Email regex pattern to ensure valid email format
      )
      .test(
        'local-part-length',
        'Email local part should be between 6 and 30 characters',
        (value) => {
          if (!value) return true; // Skip if no email provided
          const [localPart] = value.split('@'); // Get the local part before '@'
          return localPart.length >= 6 && localPart.length <= 30; // Ensure local part has valid length
        }
      )
      .test(
        'no-special-chars',
        'Email should not contain special characters in the local part',
        (value) => {
          if (!value) return true;
          const [localPart] = value.split('@'); // Validate characters in the local part
          return /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/.test(localPart); // Only letters, numbers, and periods allowed
        }
      )
      .test('single-at', "Email should contain only one '@'", (value) => {
        if (!value) return true;
        return (value.match(/@/g) || []).length === 1; // Ensure only one '@' in the email
      })
      .test(
        'dots-in-domain',
        'Email should contain 1 or 2 dots in the domain',
        (value) => {
          if (!value) return true;
          const parts = value.split('@'); // Validate the domain part of the email
          if (parts.length < 2) return false;
          const domain = parts[1];
          const dotCount = (domain.match(/\./g) || []).length; // Count dots in the domain
          return dotCount >= 1 && dotCount <= 2; // Ensure 1 or 2 dots in domain
        }
      ),

    links: yup
      .array() // links must be an array
      .of(
        yup.object().shape({
          link: yup
            .string() // link must be a string
            .test(
              'no-leading-trailing-spaces',
              'URL should not have leading or trailing spaces',
              (value) => {
                return value === value?.trim(); // Ensure no leading/trailing spaces
              }
            )
            .test(
              'no-invalid-extensions',
              'URL should not end with .php, .js, or .txt',
              (value) => {
                const invalidExtensions = ['.php', '.js', '.txt']; // Restrict certain file types
                return value
                  ? !invalidExtensions.some((ext) => value.endsWith(ext))
                  : true;
              }
            )
            .test('is-website', 'Only website links are allowed', (value) => {
              if (value) {
                try {
                  const url = new URL(value); // Parse the URL to ensure it is valid
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
                  ); // Ensure domain has valid extension
                  return hasValidExtension;
                } catch (err) {
                  return false; // Invalid URL
                }
              }
              return true; // Optional, so valid if not provided
            })
            .url('Invalid URL') // Ensures it's a valid URL format
            .nullable(true) // Allows null value for optional URLs
            .optional(), // Marks the field as optional
        })
      )
      .max(10, 'You can only add up to 10 links') // Limit the number of links to 10
      .optional(), // Links are optional

    social_links: yup
      .array()
      .of(
        yup.object().shape({
          platform: yup.string().required('Platform is required'), // Ensures platform name is required
          url: yup.string().url('Invalid URL').required('URL is required'), // Validates URL and ensures it's required
        })
      )
      .required('Social links are required'),

    openchat_user_name: yup
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

    bio: yup
      .string() // bio must be a string
      .required('This field is required') // Bio is mandatory
      .test(
        'maxWords',
        'Bio must not exceed 50 words',
        (value) =>
          !value || value.trim().split(/\s+/).filter(Boolean).length <= 50 // Limit words to 50
      )
      .test(
        'no-leading-spaces',
        'Bio should not have leading spaces',
        (value) => !value || value.trimStart() === value // No leading spaces allowed
      )
      .test(
        'maxChars',
        'Bio must not exceed 500 characters',
        (value) => !value || value.length <= 500 // Limit characters to 500
      ),

    country: yup
      .string() // country must be a string
      .required('You must select at least one option'), // Country is mandatory

    domains_interested_in: yup
      .string() // domains_interested_in must be a string
      .required('Selecting an interest is required'), // Interest selection is mandatory

    type_of_profile: yup
      .string() // type_of_profile must be a string
      .required('You must select at least one option'), // Profile type is mandatory

    reasons_to_join_platform: yup
      .string() // reasons_to_join_platform must be a string
      .test('is-non-empty', 'Selecting a reason is required', (value) =>
        /\S/.test(value) // Ensure the field is non-empty (even after trimming)
      )
      .required('Selecting a reason is required'), // Reason is mandatory

    image: yup
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
