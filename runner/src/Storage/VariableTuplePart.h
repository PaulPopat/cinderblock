#include "./Variable.h"

namespace Storage
{
  struct VariableTuplePart
  {
    std::string name;
    Variable *value;
  };
}