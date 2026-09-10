#include "LiteralInt.h"
#include "../Storage/VariablePrimitiveInt.h"
#include "extract.h"

namespace Binary {
LiteralInt::LiteralInt(const char*binary, int offset)
{
  this->end = offset + sizeof(int);
  this->value = (int*)extract(binary, offset, sizeof(int));
}

LiteralInt::~LiteralInt()
{
  delete this->value;
}

const int LiteralInt::get_end() const
{
  return this->end;
}

const Variable* LiteralInt::resolve(Closure* closure) const
{
  return closure->add_temp_variable(new VariablePrimitiveInt(*this->value));
}
}
