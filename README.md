# Unimod

## Automate Conversion Between CommonJS, ES Modules, and TypeScript

Unimod is a versatile tool designed to automate the conversion between CommonJS (CJS), ES Modules (ESM), and TypeScript (TS). It supports all possible combinations of these formats and includes additional functionalities such as logging, backups, dependency type installations, and automatic interface creation for classes.

### Features

- **Module Conversion:** Convert between CJS, ESM, and TS effortlessly.
- **Syntax Transformations:** Automatically handle syntax changes during conversion.
- **Type Conversions:** Convert JavaScript to TypeScript with type annotations.
- **File Renaming:** Rename files appropriately based on the target module system.
- **Automated Backups:** Create backups of original files before modification.
- **Logging:** Enable detailed logging of the conversion process.
- **Dependency Type Installation:** Automatically locate `package.json` and install types for all dependencies when converting to TypeScript.
- **Interface Creation:** Generate interfaces for classes when converting to TypeScript.

### Installation

You can run Unimod using one of the following methods:

#### Using NPM
```
npm run dev
```
#### or
```
npm run start
```

#### Executable

For Windows users, an executable file is available in the <a href="https://github.com/Alexandre-Chapelle/unimod/releases">releases</a> section. Download the `.exe` file and run it directly.

#### Building from Source

If the executable does not work for you, or if you wish to compile Unimod for another platform, follow the instructions below:

Visit the [Bun Bundler Executables Documentation](https://bun.sh/docs/bundler/executables) for detailed steps on compiling the tool for your desired environment.

### Usage

When you run Unimod, it will prompt you with a series of questions to guide the conversion process:

1. **Target Files Location** ```Are target files in this directory? (Y/n)```
- If `No`, it will ask: ```Please provide the directory path:```
2. **Select Files to Convert**: ```Which files do you want to convert?```

```
 ◯ JS
 ◯ MJS
 ◯ TS
```

3. **TypeScript Specific Prompt** *(Only if TS is selected)*: ```Do you want me to automatically install types for your project (from package.json)? (y/N)```
4. **Choose Transformation Format**: ```Which format do you want to transform to? (Use arrow keys)```
```    
  JS
  MJS
  TS
```
5. **Backup Option**: ```Do you want to create backups for each modified file? (y/N)```
6. **Enable Logging**: ```Do you want to enable logging? (Y/n)```

### Examples
- Simple CJS to TS transformation
#### Before
![image](https://github.com/user-attachments/assets/9de7c69b-5469-4e5c-8c88-286c90d09afd)

#### After
![image](https://github.com/user-attachments/assets/28ec80b9-d1eb-47fe-83e0-39faf34b056a)


### Roadmap

- **✅ Current Features:**
  - [x] Conversion between CJS, ESM, and TS
  - [x] Syntax and type transformations
  - [x] File renaming
  - [x] Automated backups and logging

- **🚧 Upcoming Features:**
  - [ ] Feature to automatically create interfaces for classes when converted to TS
  - [ ] Feature to add automatic typing for the whole project when converted to TS
  - [ ] Publish as an NPM package
  - [ ] Suggest changes to file/class/function/var... naming conventions based on the selected option
  - [ ] Feature to automatically add public / private modifiers to class properties / methods based on their name.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.   
<a href="https://github.com/Alexandre-Chapelle/unimod/blob/main/CONTRIBUTING.md">Contributing guidelines</a>
