#include "./LiteralArray.h"

namespace Binary
{
  LiteralArray::LiteralArray(char *binary, int offset)
  {
    int end = offset;
    auto values = Core::List<Instruction *>();
    while (binary[end] != 0)
    {
      auto next = Instruction::Parse(binary, end + 1);
      values.push(next);
      end = next->get_end();
    }

    this->end = end + 1;
    this->values = values;
  }

  const int LiteralArray::get_end() const
  {
    return this->end;
  }
}