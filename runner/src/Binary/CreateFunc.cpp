#include "CreateFunc.h"
#include "../Storage/VariablePipeable.h"

namespace Binary {
CreateFunc::CreateFunc(char* binary, int offset)
{
  this->name = new LiteralString(binary, offset);
  auto end = this->name->get_end();
  this->no_args = binary[end] != 0;
  end += 1;

  this->vars = std::vector<CreateFunc*>();
  while (binary[end] != 0) {
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
  for (const auto& var : this->vars) {
    delete var;
  }

  delete this->returns;
}

const int CreateFunc::get_end() const
{
  return this->end;
}

std::string CreateFunc::get_name()
{
  return this->name->get_value();
}

const Variable* CreateFunc::exec(Closure* closure, const VariableTuple* args)
{
  auto frame = new Frame();
  frame->add_temp_variable(args);
  closure = closure->with_frame(frame);
  for (const auto& part : args->get_parts()) {
    frame->add_variable(part.name, part.value);
  }

  for (const auto& var : this->vars) {
    frame->add_variable(
      var->get_name(),
      new VariablePipeable(
        [closure, var](const VariableTuple* inner_args) {
          return var->exec(closure, inner_args);
        },
        var->no_args
      )
    );
  }

  auto result = this->returns->resolve(closure);

  delete frame;
  return result;
}
}
