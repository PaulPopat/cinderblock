#include "LiteralString.h"
#include "../Storage/VariablePrimitiveString.h"
#include "extract.h"

namespace Binary {
LiteralString::LiteralString(const char* binary, int offset)
{
  auto length = extract<unsigned int>(binary, offset);

  offset += sizeof(unsigned int);
  this->data = std::string();
  for (unsigned int i = 0; i < *length; i++) {
    this->data += binary[offset + i];
  }

  this->end = offset + *length;
}

std::string LiteralString::get_value() const
{
  return this->data;
}

const int LiteralString::get_end() const
{
  return this->end;
}

const Variable* LiteralString::resolve(Closure* closure) const
{
  return closure->add_temp_variable(new VariablePrimitiveString(this->get_value()));
}
}
