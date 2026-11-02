#include "ShapeBool.h"
#include "../Storage/VariablePrimitiveBool.h"

namespace Binary {
ShapeBool::ShapeBool(const char* binary, int offset)
{
  this->end = offset;
}

ShapeBool::~ShapeBool()
{
}

const int ShapeBool::get_end() const
{
  return this->end;
}

const bool ShapeBool::matches(const Variable* subject) const
{
  auto possible = VariablePrimitiveBool::FromVariable(subject);
  if (possible == nullptr) {
    return false;
  }

  return true;
}
}
