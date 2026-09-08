#include "./Tuple.h"
#include "./LiteralString.h"

namespace Binary
{
  Tuple::Tuple(char *binary, int offset)
  {
    int end = offset;
    auto names = Core::List<LiteralString *>();
    auto values = Core::List<Instruction *>();
    while (binary[end] != 0)
    {
      auto name = new LiteralString(binary, end + 1);
      auto next = Instruction::Parse(binary, name->get_end());

      names.push(name);
      values.push(next);
      end = next->get_end();
    }

    this->end = end + 1;
    this->names = names;
    this->values = values;
  }

  const int Tuple::get_end() const
  {
    return this->end;
  }
}