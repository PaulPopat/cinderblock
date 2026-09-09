#include "LiteralArray.h"
#include "../Storage/VariableArray.h"

namespace Binary
{
  LiteralArray::LiteralArray(char *binary, int offset)
  {
    int end = offset;
    auto values = std::vector<Instruction *>();
    while (binary[end] != 0)
    {
      auto next = Instruction::Parse(binary, end + 1);
      values.push_back(next);
      end = next->get_end();
    }

    this->end = end + 1;
    this->values = values;
  }

  LiteralArray::~LiteralArray()
  {
    for (const auto &value : this->values)
    {
      delete value;
    }
  }

  const int LiteralArray::get_end() const
  {
    return this->end;
  }

  const Variable *LiteralArray::resolve(Closure *closure) const
  {
    auto input = std::vector<const Variable *>();
    for (const auto &instruction : this->values)
    {
      input.push_back(instruction->resolve(closure));
    }

    return new VariableArray(input);
  }
}