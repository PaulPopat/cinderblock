#include "LiteralFloat.h"
#include "../Storage/VariablePrimitiveFloat.h"
#include "extract.h"

namespace Binary {
LiteralFloat::LiteralFloat(const char* binary, int offset)
{
  this->end = offset + sizeof(float);
  this->value = *extract<float>(binary, offset);
}

LiteralFloat::~LiteralFloat()
{
}

const int LiteralFloat::get_end() const
{
  return this->end;
}

const Variable* LiteralFloat::resolve(Closure* closure) const
{
  return closure->add_temp_variable(new VariablePrimitiveFloat(this->value));
}
}
