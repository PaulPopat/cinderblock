#pragma once

#include "Variable.h"

namespace Storage {
struct VariableTuplePart {
  const std::string name;
  const Variable* value;
};
}
