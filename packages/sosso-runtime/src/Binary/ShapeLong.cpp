#include "ShapeLong.h"
#include "../Storage/VariablePrimitiveLong.h"

namespace Binary {
ShapeLong::ShapeLong(const char* binary, int offset)
{
  this->end = offset;
}

ShapeLong::~ShapeLong()
{
}

const int ShapeLong::get_end() const
{
  return this->end;
}

const bool ShapeLong::matches(const Variable* subject) const
{
  auto possible = VariablePrimitiveLong::FromVariable(subject);
  if (possible == nullptr) {
    return false;
  }

  return true;
}
}
