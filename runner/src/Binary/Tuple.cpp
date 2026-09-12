#include "Tuple.h"
#include "../Storage/VariableTuple.h"
#include "LiteralString.h"
#include "extract.h"

namespace Binary {
Tuple::Tuple(const char* binary, int offset)
{
  auto result = extract_array<TuplePart>(binary, offset, [](const char* binary, int offset) {
    auto name = new LiteralString(binary, offset);
    auto value = Instruction::Parse(binary, name->get_end());
    ExtractArrayItemResult<TuplePart> result = {
      { name, value },
      value->get_end()
    };
    return result;
  });

  this->end = result.offset;
  this->values = result.data;
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
