#include "CreateFunc.h"

namespace Binary
{
  CreateFunc::CreateFunc(char *binary, int offset)
  {
    this->name = new LiteralString(binary, offset);
    auto end = this->name->get_end();
    this->no_args = binary[end] != 0;
    end += 1;

    this->vars = std::vector<CreateFunc *>();
    while (binary[end] != 0)
    {
      auto next = new CreateFunc(binary, end + 1);
      this->vars.push_back(next);
      end = next->get_end();
    }

    this->returns = Instruction::Parse(binary, end);
    this->end = this->returns->get_end();
  }

  CreateFunc::~CreateFunc()
  {
    delete this->name;
    for (const auto &var : this->vars)
    {
      delete var;
    }

    delete this->returns;
  }

  const int CreateFunc::get_end() const
  {
    return this->end;
  }
}