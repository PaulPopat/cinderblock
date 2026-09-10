#include "Tuple.h"
#include "../Storage/VariableTuple.h"
#include "LiteralString.h"

namespace Binary {
Tuple::Tuple(char* binary, int offset)
{
  int end = offset;
  auto values = std::vector<TuplePart>();
  while (binary[end] != 0) {
    auto name = new LiteralString(binary, end + 1);
    auto value = Instruction::Parse(binary, name->get_end());

    values.push_back({ name, value });
    end = value->get_end();
  }

  this->end = end + 1;
  this->values = values;
}

Tuple::~Tuple()
{
  for (const auto& value : this->values) {
    delete value.name;
    delete value.value;
  }
}

const int Tuple::get_end() const
{
  return this->end;
}

const Variable* Tuple::resolve(Closure* closure) const
{
  auto parts = std::vector<VariableTuplePart>();
  for (const auto& part : this->values) {
    parts.push_back({ part.name->get_value(), part.value->resolve(closure) });
  }

  return closure->add_temp_variable(new VariableTuple(parts));
}
}
