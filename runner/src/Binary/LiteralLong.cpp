#include "LiteralLong.h"
#include "../Storage/VariablePrimitiveLong.h"
#include "extract.h"

namespace Binary {
LiteralLong::LiteralLong(const char*binary, int offset)
{
  this->end = offset + sizeof(long);
  this->value = (long*)extract(binary, offset, sizeof(long));
}

LiteralLong::~LiteralLong()
{
  delete this->value;
}

const int LiteralLong::get_end() const
{
  return this->end;
}

const Variable* LiteralLong::resolve(Closure* closure) const
{
  return closure->add_temp_variable(new VariablePrimitiveLong(*this->value));
}
}
