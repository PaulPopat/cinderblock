#include "ShapePipeable.h"
#include "../Storage/VariablePipeable.h"

namespace Binary {
ShapePipeable::ShapePipeable(const char* binary, int offset)
{
  this->end = offset;
}

ShapePipeable::~ShapePipeable()
{
}

const int ShapePipeable::get_end() const
{
  return this->end;
}

const bool ShapePipeable::matches(const Variable* subject) const
{
  auto possible = VariablePipeable::FromVariable(subject);
  if (possible == nullptr) {
    return false;
  }

  return true;
}
}
