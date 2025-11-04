I want to change the core of the Framework in order to make the it modular and flexible.

The reason is files within this framework will need to created/updated or even deleted as the user uses it.

To make this process as user-friendly as possible we will create Internal AI Agents for performing these low level tasks and abstract away the frameworks complexity.

For example, the user will say: "Take these files, process them like this and then store them at the Frontend Registry." The Agent responsible for managing the Registries shall know the conventions that we will define, follow the rules we will define and execute the corresponding scripts to resolve the User request.

Our main task is to make these actions as deterministic as possible by writing templates, rules and scripts. This way we can keep agents on track.

As specialized Agents at their core at just llm + context + prompting + tools, we need to define a solid architecture for managing all that.

## LLM

This one is super easy, as it is the user responsibility to select the LLM. This framework is LLM-agnostic.

## Context

This is the most tricky one. As there is no defined way of managing contexts, its up to us to define a solid architecture for it.

My idea is follow the Context Chips architecture that we are currently using. We can define many Registries (aka Context Groups) and each one of them will contain many Context Chips. A good example can be found here: `registries\frontend.registry.ts`.

This provide a very modular and flexible way of managing contexts, however I believe we need to a metal model or some kind of conventions to define different kinds of Context Registries. For example, in a monorepo, having a `frontend` and `backend` registries where each has its own set of Context Chips, like techstack or file-structure makes total sense.

For repo's that are more specific, like frontend-only repos, having a `frontend` registry does NOT really make sense. Here would be better to have a `project-details` registry that contains context chips like `techstack`, `design-system`, `file-structure`, etc.

Of course, context chips are fundamental for the framework as well. That makes Context Chips the smallest unit of context that we can have. thus a primitive.

For our Framework, we need to define a set of static Context Registries. Here are some examples:

- roles: The keys would be the archetypes and the values would be the context chips defining their characteristics.
- permissions: The keys would be the permission levels and the values would be the context chips defining their characteristics.
- behaviors: The keys would be the behavior profiles and the values would be the context chips defining their characteristics.

As you can see we will use TS enums to define the keys of these registries.

It would be very useful to have Typescript Utility Types to for managing these registries and their keys/values. Like for example, getting the keys of a registry as a union type.

## Prompting

In order to effectively communicate with our agents, and reduce duplication we need to establish a clear prompting strategy. I do not plan on going too deep into this right now, but here are some initial thoughts:

1. Create a way to compose prompts dynamically using predefined templates and user inputs. These would be created as Typescript files. Generators will be used to convert them into the vendor's slice command type.
2. The main reason for this is to enable our Internal AI Agents to create/modify prompts per user's request.
3. We need to define a set of base prompt templates. In order for them to contain the necessary structure for the agents to work properly.

A nice idea would be that Agents can have a property called `actions` that would contain a list of prompt objects. When the Agent is generated, these prompts would be converted into the vendor's slice command type. They should also follow a naming convention like: `<agent-name>.<action-name>.prompt.ts`.

## Tools

We can have 2 kinds of tools:

1. Internal Cross-platform scripts (bash and powershell): These will be used to perform framework related tasks. Like running agent generators, scaffolding new context chips, registries, etc. Basically, these will tools used by the Internal AI Agents to manage the framework itself.

2. External Cross-platform scripts (bash and powershell): These will be used to perform tasks that are specific to the user's project. Like creating a new React component, fetching data from an external API, etc. These tools will be defined by the user and will be used by the Specialized AI Agents to perform project-specific tasks.

For this one we need to perform some research. Probably the best way is to create MCP Servers that would expose the necessary functionality via API endpoints. Then our Agents would just need to call these endpoints to perform the required actions.

## Terminology

- **Internal AI Agents**: Agents that are responsible for managing the framework itself. They will use internal cross-platform scripts to perform their tasks.
- **Specialized AI Agents**: Agents that are responsible for performing project-specific tasks. They will use external cross-platform scripts to perform their tasks.
- **Context Registries**: Collections of Context Chips that are grouped together based on their purpose or domain.
- **Context Chips**: The smallest unit of context that can be used by the agents.
