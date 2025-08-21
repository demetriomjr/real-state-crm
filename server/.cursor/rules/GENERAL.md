# Base instructions for LLMs.
- These instructions are used as a base for all other instructions.
- LLMs should follow the architectural rules defined in the project.
- LLMs should be aware of the project stack and use the appropriate technologies.
- LLMs should adhere to the folder structure and organization defined in the project architecture.
- LLMs shouldn't create new folders without developer approval.

# NPM Install
- Do not install dependencies that are not listed in the [Project Stack]
- Prefer using the package manager's built-in commands over manual installation.
- Prefer using the latest stable versions of dependencies.
- Prefer using native modules over third-party ones when possible.
- Avoid using deprecated or unmaintained packages.

# Code engineering rules
- LLMs should follow the coding standards and best practices defined in the project.
- LLMs should write clean, maintainable code.
    - Upon clean architecture, interface contracts will not be used.
    - Do not use Dependency Injection to instantiate Repositories and Controllers.
- LLMs should use meaningful names for variables, functions, and classes.
- LLMs should use SOLID principles to guide the design of their code.
- Use early returns patterns
- Use switch statements for conditional logic over if-else chains.
- Avoid method/function nesting over small chunk of total code, unless reusable.
- Avoid instantialization of classes within methods.
- Avoid constant declarations with the goal of uniquely extracting another constant.
    - Given the code as follows:
        ```
        const aConst = object.GetValue();
        const bConst = aConst.GetAnotherValue();
        
        ```
    Simply try to avoid the use of intermediate constants when they are not necessary.
    For maintainance and readability purposes, rather the following approach:
        ```
        const finalConst = object.GetValue();
                                 .GetAnotherValue();
        ```
    This way, only one constant was created and is still readable for humans.
- Avoid using magic numbers or strings in your code.
    - Instead, use named constants to improve readability and maintainability.
- Respect Spacing and indentation.
- Avoid unnecessary whitespace and blank lines.
- Use consistent naming conventions for variables, functions, and classes.
- Do not comment on the code at all.
- Use the Method/Function structure as follows:
    ```
    function methodName(parameters) {
        <constants and variables>
        <white line for spacing>
        <conditions and logic>
        <white line for spacing>
        <last return statement>
    }
    ```
# Workflow
- Please confirm with the user to run a workflow file, if it's name is set at (WORKFLOW_LOG.md)
    - This file is fed manually by the developer.
    - The workflow file is a markdown that contains the names of all approved workflows executed by the developer.

# Previous mistakes to avoid
- Do not delete .env file.
- When trying to run commands at terminal, remember this is a windows 11 power shell terminal.
- do not delete files under /public without asking the developer.