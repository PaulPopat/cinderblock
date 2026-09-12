#include "CreateFunc.h"
#include "../Storage/VariablePipeable.h"
#include "extract.h"

namespace Binary {
CreateFunc::CreateFunc(const char* binary, int offset)
{
  this->name = new LiteralString(binary, offset);
  this->no_args = binary[this->name->get_end()] != 0;

  auto vars = extract_array<const CreateFunc*>(binary, this->name->get_end() + 1, [](const char* binary, int offset) {
    auto final = new CreateFunc(binary, offset);
    ExtractArrayItemResult<const CreateFunc*> result = {
      final,
      final->get_end()
    };

    return result;
  });

  this->vars = vars.data;
  this->returns = Instruction::Parse(binary, vars.offset);
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

std::string CreateFunc::get_name() const
{
  return this->name->get_value();
}

const Variable* CreateFunc::exec(Closure* closure, const VariableTuple* args) const
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
