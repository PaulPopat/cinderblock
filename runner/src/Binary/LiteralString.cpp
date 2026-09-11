#include "LiteralString.h"
#include "../Storage/VariablePrimitiveString.h"

namespace Binary {
LiteralString::LiteralString(const char* binary, int offset)
{
  auto end = offset;

  while (binary[end] != 0) {
    end += 1;
  }

  this->data = std::string();
  auto string_length = end - offset;
  auto input = new char[string_length + 1]();
  for (unsigned int i = 0; i < string_length; i++) {
    this->data += binary[offset + i];
  }

  this->data += '\0';

  this->end = end + 1;
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
