#include "./Closure.h"

namespace Storage
{
  Closure::Closure(Frame *globals, std::vector<Frame *> frames)
  {
    this->globals = globals;
    this->frames = frames;
  }

  Closure::~Closure()
  {
    for (const auto &frame : this->frames)
    {
      delete frame;
    }

    delete this->globals;
  }

  Variable *Closure::search(char *name)
  {
    for (const auto &frame : this->frames)
    {
      auto possible = frame->search(name);
      if (possible != nullptr)
      {
        return possible;
      }
    }

    throw "Variable not resolved";
  }

  Closure *Closure::with_frame(Frame *frame)
  {
    auto input = std::vector<Frame *>();
    for (const auto &frame : this->frames)
    {
      input.push_back(frame);
    }

    input.push_back(frame);

    return new Closure(this->globals, input);
  }

  Closure *Closure::add_variable(char *name, Variable *value)
  {
    auto frame = *this->frames.end();
    frame->add_variable(name, value);
    return this;
  }

  Variable *Closure::search_global(char *name)
  {
    auto possible = this->globals->search(name);
    if (possible != nullptr)
    {
      return possible;
    }

    throw "Global not resolved";
  }
}