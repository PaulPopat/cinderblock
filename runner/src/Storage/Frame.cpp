#include "Frame.h"
#include <string>
#include "../Core/string_equals.h"

namespace Storage
{
  Frame::Frame()
  {
    this->data = std::vector<VariableTuplePart>();
  }

  Frame::~Frame()
  {
    for (const auto &part : this->data)
    {
      delete part.name;
      delete part.value;
    }
  }

  Variable *Frame::search(char *name)
  {
    for (const auto &variable : this->data)
    {
      if (Core::string_equals(variable.name, name))
      {
        return variable.value;
      }
    }

    return nullptr;
  }

  Frame *Frame::add_variable(char *name, Variable *value)
  {
    this->data.push_back({name, value});
    return this;
  }

  Frame *Frame::merge(const Frame *input)
  {
    for (const auto &variable : input->data)
    {
      this->add_variable(variable.name, variable.value);
    }

    return this;
  }
}