#include "LiteralString.h"
#include "../Storage/VariablePrimitiveString.h"

namespace Binary {
LiteralString::LiteralString(char* binary, int offset)
  : binary(binary)
  , offset(offset)
{
  int end = offset;
  // 3 is end of text according to the ascii standard so we use that when encoding strings
  while (binary[end] != 3) {
    end += 1;
  }

  this->end = end + 2;
}

std::string LiteralString::get_value() const
{
  auto string_length = this->end - this->offset - 2;
  auto input = new char[string_length + 1]();
  for (unsigned int i = 0; i < string_length; i++) {
    input[i] = this->binary[this->offset + i];
  }

  input[string_length] = 0;

  return std::string(input);
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
