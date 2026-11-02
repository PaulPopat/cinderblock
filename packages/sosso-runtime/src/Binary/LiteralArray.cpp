#include "LiteralArray.h"
#include "../Storage/VariableArray.h"
#include "extract.h"

namespace Binary {
LiteralArray::LiteralArray(const char* binary, int offset)
{
  auto result = extract_array<const Instruction*>(binary, offset, [](const char* binary, int offset) {
    auto next = Instruction::Parse(binary, offset);
    ExtractArrayItemResult<const Instruction*> result = { next, next->get_end() };
    return result;
  });

  this->end = result.offset;
  this->values = result.data;
}

LiteralArray::~LiteralArray()
{
  for (const auto& value : this->values) {
    delete value;
  }
}

const int LiteralArray::get_end() const
{
  return this->end;
}

const Variable* LiteralArray::resolve(Closure* closure) const
{
  auto input = std::vector<const Variable*>();
  for (const auto& instruction : this->values) {
    input.push_back(instruction->resolve(closure));
  }

  return closure->add_temp_variable(new VariableArray(input));
}
}
