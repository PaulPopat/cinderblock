#include "Variable.h"

namespace Storage {
struct VariableRegistration {
  char identifier;
  std::function<Variable*(val data)> init;
};

std::vector<VariableRegistration> registered = std::vector<VariableRegistration>();

Variable* Variable::Parse(val value)
{
  auto type_name = value["type"].as<char>();
  for (const auto& entry : registered) {
    if (entry.identifier != type_name) {
      continue;
    }

    return entry.init(value["data"]);
  }

  throw "Unknown variable type";
}

void Variable::Register(char identifier, std::function<Variable*(val data)> init)
{
  registered.push_back({ identifier, init });
}
}
