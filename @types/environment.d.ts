declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            CI?: string;
            /** set this to make sure the extension id is the same for unpacked extensions
             * @see https://developer.chrome.com/docs/apps/app_identity/#copy_key */
            MANIFEST_KEY?: string;
            /**
             * The Node semantic versioning-compatible version of the extension. For preview-style releases, this variable
             * converts versions like 1.0.0.100 to 1.0.0-beta.1.
             */
            SEMANTIC_VERSION?: string;
        }
    }

    type Environment = typeof process.env.NODE_ENV;

    /**
     * An object representing configuration for adding a new file to be built for the extension
     */
    export type ExtensionEntry = {
        /** paths to the JS/TS files to be built for this entry */
        path: string[];
        /** whether or not to generate an HTML file for this entry */
        generateHTML?: boolean;
        /** whether or not to add the react devtools to the beginning of the path */
        addDevtools?: boolean;
        /** the environments that this entry should be built for */
        mode: Environment[];
    };
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
