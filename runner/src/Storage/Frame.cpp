#include "Frame.h"
#include "../Core/string_equals.h"

namespace Storage
{
  Frame::Frame()
  {
    this->data = Core::List<FrameVariable *>();
  }

  Variable *Frame::search(char *name)
  {
    for (const auto &variable : this->data)
    {
      if (Core::string_equals(variable->name, name))
      {
        return variable->value;
      }
    }

    return nullptr;
  }

  Frame *Frame::add_variable(char *name, Variable *value)
  {
    auto input = new FrameVariable();
    input->name = name;
    input->value = value;
    this->data.push(input);
    return this;
  }

  Frame *Frame::merge(const Frame *input)
  {
    for (const auto &variable : input->data)
    {
      this->add_variable(variable->name, variable->value);
    }

    return this;
  }
}