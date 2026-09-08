#include "./CreateFunc.h"

namespace Binary
{
  CreateFunc::CreateFunc(char *binary, int offset)
  {
    this->name = new LiteralString(binary, offset);
    auto end = this->name->get_end();
    this->no_args = binary[end] != 0;
    end += 1;

    this->vars = List<CreateFunc *>();
    while (binary[end] != 0)
    {
      auto next = new CreateFunc(binary, end + 1);
      this->vars.push(next);
      end = next->get_end();
    }

    this->returns = Instruction::Parse(binary, end);
    this->end = this->returns->get_end();
  }

  const int CreateFunc::get_end() const
  {
    return this->end;
  }
}