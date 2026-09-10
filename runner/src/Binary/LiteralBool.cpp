#include "LiteralBool.h"
#include "../Storage/VariablePrimitiveBool.h"

namespace Binary {
LiteralBool::LiteralBool(const char*binary, int offset)
{
  this->value = binary[offset] != 0;
  this->end = offset + 1;
}

const int LiteralBool::get_end() const
{
  return this->end;
}

const Variable* LiteralBool::resolve(Closure* closure) const
{
  return closure->add_temp_variable(new VariablePrimitiveBool(this->value));
}
}
